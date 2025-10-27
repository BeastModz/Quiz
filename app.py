from flask import Flask, render_template, jsonify, request, send_from_directory
import json
import os

app = Flask(__name__)

# Path to the questions JSON file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(BASE_DIR, 'data', 'quiz_questions.json')

@app.route('/')
def index():
    return send_from_directory('.', 'quiz_practice.html')

@app.route('/images/<path:filename>')
def serve_image(filename):
    """Serve image files from the images directory"""
    return send_from_directory('images', filename)

@app.route('/api/questions', methods=['GET'])
def get_questions():
    """Get all questions from the JSON file"""
    try:
        with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        return jsonify(questions)
    except FileNotFoundError:
        return jsonify({'error': f'Questions file not found at {QUESTIONS_FILE}'}), 404
    except Exception as e:
        print(f"❌ Error loading questions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/questions', methods=['POST'])
def save_questions():
    """Save all questions to the JSON file"""
    try:
        questions = request.json
        with open(QUESTIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        return jsonify({'success': True, 'message': 'Questions saved successfully'})
    except Exception as e:
        print(f"❌ Error saving questions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/question/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    """Update a single question"""
    try:
        with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        # Find and update the question
        updated_question = request.json
        for i, q in enumerate(questions):
            if q['id'] == question_id:
                questions[i] = updated_question
                break
        
        # Save back to file
        with open(QUESTIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        return jsonify({'success': True, 'message': 'Question updated successfully'})
    except Exception as e:
        print(f"❌ Error updating question: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/question/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """Delete a single question"""
    try:
        with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        # Remove the question
        questions = [q for q in questions if q['id'] != question_id]
        
        # Save back to file
        with open(QUESTIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        return jsonify({'success': True, 'message': 'Question deleted successfully'})
    except Exception as e:
        print(f"❌ Error deleting question: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/question', methods=['POST'])
def add_question():
    """Add a new question"""
    try:
        with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        new_question = request.json
        
        # Assign new ID
        max_id = max([q['id'] for q in questions], default=0)
        new_question['id'] = max_id + 1
        
        questions.append(new_question)
        
        # Save back to file
        with open(QUESTIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        return jsonify({'success': True, 'question': new_question})
    except Exception as e:
        print(f"❌ Error adding question: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🎓 Quiz Practice App - Flask Server")
    print("=" * 60)
    print(f"📂 Serving from: {os.getcwd()}")
    print(f"📝 Questions file: {QUESTIONS_FILE}")
    
    # Check if questions file exists
    if os.path.exists(QUESTIONS_FILE):
        print(f"✅ Questions file found")
    else:
        print(f"⚠️  Questions file will be created on first access")
    
    print(f"🌐 Open in browser: http://localhost:5000")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
