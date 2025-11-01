import PyPDF2

pdf_path = "C:\\Users\\mform\\Downloads\\Practice Exam.pdf"

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    full_text = ""
    
    print(f"Extracting text from {len(pdf_reader.pages)} pages...\n")
    
    for i, page in enumerate(pdf_reader.pages):
        text = page.extract_text()
        full_text += text + "\n\n"
    
    # Save to file for manual review
    with open('human_dynamics_extracted.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    
    print(f"✅ Extracted text saved to: human_dynamics_extracted.txt")
    print(f"Total characters: {len(full_text)}")
    
    # Print a sample
    print("\n" + "="*50)
    print("SAMPLE (first 2000 characters):")
    print("="*50)
    print(full_text[:2000])
