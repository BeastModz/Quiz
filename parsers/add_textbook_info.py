"""
Add textbook mapping information to quiz questions
"""
import json

# Load the textbook mappings for both exams
with open('exam1_to_textbook_mapping_detailed.json', 'r', encoding='utf-8') as f:
    exam1_mapping = json.load(f)

with open('exam2_to_textbook_mapping_detailed.json', 'r', encoding='utf-8') as f:
    exam2_mapping = json.load(f)

# Load the quiz questions
with open('data/quiz_questions.json', 'r', encoding='utf-8') as f:
    quiz_questions = json.load(f)

# Create mappings by question number for both exams
exam1_mapping_by_qnum = {item['qnum']: item for item in exam1_mapping}
exam2_mapping_by_qnum = {item['qnum']: item for item in exam2_mapping}

# Update quiz questions with textbook information
updated_count = 0
for question in quiz_questions:
    if 'originalNumber' not in question:
        continue
    
    qnum = question['originalNumber']
    mapping = None
    
    # Select the appropriate mapping based on exam
    if question.get('exam') == 'Exam 1' and qnum in exam1_mapping_by_qnum:
        mapping = exam1_mapping_by_qnum[qnum]
    elif question.get('exam') == 'Exam 2' and qnum in exam2_mapping_by_qnum:
        mapping = exam2_mapping_by_qnum[qnum]
    
    if mapping:
        # Add the new fields
        question['textbookReference'] = {
            'chapter': mapping['theory']['chapter'],
            'section': mapping['theory']['section_or_topic'],
            'pages': mapping['theory']['pages_approx']
        }
        
        # Update or add explanation
        if mapping.get('explanation'):
            question['explanation'] = mapping['explanation']
        
        # Add additional helpful information
        question['notes'] = mapping.get('notes', '')
        question['keyPoints'] = mapping.get('key_points', [])
        question['commonPitfalls'] = mapping.get('common_pitfalls', [])
        question['crossLinks'] = mapping.get('cross_links', [])
        
        updated_count += 1
        exam_label = question.get('exam', 'Unknown')
        print(f"✅ Updated {exam_label} Q{qnum}: {question['question'][:50]}...")

# Save the updated questions
with open('data/quiz_questions.json', 'w', encoding='utf-8') as f:
    json.dump(quiz_questions, f, indent=2, ensure_ascii=False)

print(f"\n🎉 Successfully updated {updated_count} questions with textbook information!")
print(f"📝 Total questions in file: {len(quiz_questions)}")

# Show breakdown by exam
exam1_count = len([q for q in quiz_questions if q.get('exam') == 'Exam 1' and 'textbookReference' in q])
exam2_count = len([q for q in quiz_questions if q.get('exam') == 'Exam 2' and 'textbookReference' in q])
print(f"📚 Exam 1: {exam1_count} questions with textbook info")
print(f"📚 Exam 2: {exam2_count} questions with textbook info")
