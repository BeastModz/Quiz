import json
import PyPDF2
import re

def parse_human_dynamics_pdf(pdf_path):
    """
    Parse the Human Dynamics Practice Exam PDF
    """
    questions = []
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            full_text = ""
            
            # Extract text from all pages
            for page in pdf_reader.pages:
                full_text += page.extract_text() + "\n"
            
            # Parse questions from the extracted text
            # Pattern to match questions (numbered followed by question text)
            question_pattern = r'(\d+)\.\s+(.*?)(?=\d+\.|$)'
            
            # Find all questions
            matches = re.findall(question_pattern, full_text, re.DOTALL)
            
            for match in matches:
                q_num = int(match[0])
                q_content = match[1].strip()
                
                # Extract question text and options
                lines = q_content.split('\n')
                question_text = []
                options = []
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Check if line is an option (A., B., C., D., etc.)
                    if re.match(r'^[A-D]\.\s+', line):
                        options.append(line[3:].strip())
                    else:
                        question_text.append(line)
                
                if question_text and options:
                    questions.append({
                        "id": 160 + q_num,  # Start after anatomy questions
                        "exam": "Human Dynamics",
                        "type": "true-false" if len(options) == 2 else "multiple-choice",
                        "question": ' '.join(question_text),
                        "image": None,
                        "options": options,
                        "correct": "A",  # Placeholder - needs manual correction
                        "explanation": None,
                        "textbookReference": None,
                        "notes": "",
                        "keyPoints": [],
                        "commonPitfalls": [],
                        "crossLinks": [],
                        "originalNumber": q_num
                    })
            
            return questions
            
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return []

def manual_entry_template():
    """
    Template for manually entering Human Dynamics questions
    """
    return {
        "id": 161,  # Start after anatomy questions (160 total)
        "exam": "Human Dynamics",
        "type": "multiple-choice",  # or "true-false"
        "question": "Your question text here",
        "image": None,
        "options": [
            "Option A text",
            "Option B text",
            "Option C text",
            "Option D text"
        ],
        "correct": "A",  # A, B, C, or D
        "explanation": "Detailed explanation of the correct answer",
        "explanation_mechanism": "How/why this works",
        "why_others_are_wrong": [
            "Why A is wrong",
            "Why B is wrong",
            "Why C is wrong"
        ],
        "citations": [],
        "textbookReference": {
            "chapter": "Ch. X",
            "section": "Section name",
            "pages": "Page range",
            "pages_realbook": "Actual book page range"
        },
        "notes": "Additional notes",
        "keyPoints": [
            "Key point 1",
            "Key point 2"
        ],
        "commonPitfalls": [
            "Common mistake 1",
            "Common mistake 2"
        ],
        "crossLinks": [
            "Related topic 1",
            "Related topic 2"
        ],
        "originalNumber": 1
    }

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        print(f"Parsing Human Dynamics PDF: {pdf_path}")
        questions = parse_human_dynamics_pdf(pdf_path)
        
        if questions:
            output_file = 'data/human_dynamics_parsed.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(questions, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Parsed {len(questions)} questions from Human Dynamics exam")
            print(f"📄 Saved to: {output_file}")
            print(f"\n⚠️  Note: All answers are set to 'A' by default. Please update with correct answers.")
        else:
            print("❌ No questions found. Please check the PDF format.")
    else:
        print("Usage: python parse_human_dynamics.py <path_to_pdf>")
        print("\nOr use the template:")
        print(json.dumps(manual_entry_template(), indent=2))
