import json

# Load corrected Exam 1
with open('exam1_parsed.json', 'r', encoding='utf-8') as f:
    exam1_questions = json.load(f)

# Load existing quiz questions to get Exam 2
try:
    with open('quiz_questions.json', 'r', encoding='utf-8') as f:
        existing_questions = json.load(f)
    
    # Filter out Exam 2 questions
    exam2_questions = [q for q in existing_questions if q.get('exam') == 'Exam 2']
    print(f"📚 Found {len(exam2_questions)} Exam 2 questions to preserve")
except:
    exam2_questions = []
    print("⚠️ No existing Exam 2 questions found")

# Renumber Exam 2 to start after Exam 1
id_counter = 81  # Start after 80 Exam 1 questions
for q in exam2_questions:
    q['id'] = id_counter
    id_counter += 1

# Combine both exams
all_questions = exam1_questions + exam2_questions

# Save combined questions
with open('quiz_questions.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"\n✅ SUCCESS!")
print(f"📝 Exam 1: {len(exam1_questions)} questions")
print(f"📝 Exam 2: {len(exam2_questions)} questions")
print(f"📊 Total: {len(all_questions)} questions")
print(f"💾 Saved to: quiz_questions.json")
