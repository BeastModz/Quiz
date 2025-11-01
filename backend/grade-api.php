<?php
/**
 * Quiz Grader API - PHP Backend for InfinityFree
 * 
 * Simple OpenAI API proxy for essay question grading
 * Keeps API key secure server-side
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://beastmodz.github.io'); // Your GitHub Pages URL
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get request data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['question_id']) || !isset($data['student_answer'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: question_id, student_answer']);
    exit;
}

// Load rubrics
$rubrics_file = __DIR__ . '/../data/all_rubrics.en.json';
if (!file_exists($rubrics_file)) {
    http_response_code(500);
    echo json_encode(['error' => 'Rubrics file not found']);
    exit;
}

$rubrics_data = json_decode(file_get_contents($rubrics_file), true);
$rubric = null;

foreach ($rubrics_data['questions'] as $q) {
    if ($q['question_id'] === $data['question_id']) {
        $rubric = $q;
        break;
    }
}

if (!$rubric) {
    http_response_code(404);
    echo json_encode(['error' => 'Question not found']);
    exit;
}

// Your OpenAI API key (store securely, don't commit to git!)
// In production, use environment variables or a config file outside web root
$api_key = getenv('OPENAI_API_KEY') ?: 'YOUR_API_KEY_HERE';

if ($api_key === 'YOUR_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode(['error' => 'API key not configured']);
    exit;
}

// Prepare OpenAI request
$student_answer = $data['student_answer'];
$question_title = $rubric['title'];
$references = implode("\n", $rubric['references']);

$concepts = [];
foreach ($rubric['concepts'] as $c) {
    $synonyms = implode(', ', $c['synonyms']);
    $required = $c['required'] ? ' (required)' : '';
    $concepts[] = "- {$c['id']}: [{$synonyms}]{$required}";
}
$concepts_text = implode("\n", $concepts);

$forbidden_text = !empty($rubric['forbidden']) ? 
    "Forbidden phrases: " . implode(', ', $rubric['forbidden']) : '';

$prompt = <<<EOT
You are a strict academic grader for a Human Dynamics exam. Grade the following answer.

Question: {$question_title}

Reference Answer:
{$references}

Required Concepts:
{$concepts_text}

{$forbidden_text}

Student Answer:
{$student_answer}

Evaluate the student's answer and return ONLY valid JSON in this exact format:
{
  "grade": "correct|partial|wrong",
  "score": 0.0-1.0,
  "points": 0-{$rubric['max_points']},
  "feedback": "Brief explanation of grading",
  "missing_concepts": ["concept_id1", "concept_id2"],
  "strengths": ["what they got right"],
  "improvements": ["what they missed"]
}

Be strict but fair. Check for all required concepts and forbidden phrases.
EOT;

// Call OpenAI API
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'model' => 'gpt-4o-mini',
    'messages' => [
        [
            'role' => 'system',
            'content' => 'You are a strict academic grader. Return only valid JSON.'
        ],
        [
            'role' => 'user',
            'content' => $prompt
        ]
    ],
    'temperature' => 0.3,
    'max_tokens' => 500
]));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    http_response_code(502);
    echo json_encode([
        'error' => 'OpenAI API error',
        'details' => json_decode($response, true)
    ]);
    exit;
}

$openai_response = json_decode($response, true);
$content = $openai_response['choices'][0]['message']['content'] ?? '';

// Extract JSON from response (in case GPT adds extra text)
preg_match('/\{.*\}/s', $content, $matches);
$result_json = $matches[0] ?? $content;

$result = json_decode($result_json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to parse OpenAI response',
        'raw_response' => $content
    ]);
    exit;
}

// Return the grading result
echo json_encode([
    'success' => true,
    'question_id' => $data['question_id'],
    'max_points' => $rubric['max_points'],
    'result' => $result
]);
?>
