import PyPDF2
import sys

pdf_path = sys.argv[1] if len(sys.argv) > 1 else "C:\\Users\\mform\\Downloads\\Practice Exam.pdf"

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    print(f"Number of pages: {len(pdf_reader.pages)}\n")
    
    for i, page in enumerate(pdf_reader.pages):
        print(f"\n{'='*50}")
        print(f"PAGE {i+1}")
        print(f"{'='*50}\n")
        text = page.extract_text()
        print(text[:1000])  # Print first 1000 characters
        if i == 0:  # Only show first page for now
            break
