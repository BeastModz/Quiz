import json

# Load Exam 1
with open('exam1_parsed.json', 'r', encoding='utf-8') as f:
    exam1_questions = json.load(f)

# Load Exam 2
with open('exam2_parsed.json', 'r', encoding='utf-8') as f:
    exam2_questions = json.load(f)

# Combine both exams
all_questions = exam1_questions + exam2_questions

# Save combined questions
with open('quiz_questions.json', 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print(f"\n✅ SUCCESS!")
print(f"📝 Exam 1: {len(exam1_questions)} questions (IDs 1-80)")
print(f"📝 Exam 2: {len(exam2_questions)} questions (IDs 81-160)")
print(f"📊 Total: {len(all_questions)} questions")
print(f"💾 Saved to: quiz_questions.json")
print(f"\n🎯 Pass requirements:")
print(f"   - Exam 1: 52/80 (65%)")
print(f"   - Exam 2: 52/80 (65%)")
print(f"   - Both: 104/160 (65%)")
