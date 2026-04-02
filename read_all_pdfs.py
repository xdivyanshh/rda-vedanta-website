import fitz
import glob
import os

pdfs = glob.glob('src/assets/catalogs/*.pdf')
all_text = ""

for pdf in pdfs:
    all_text += f"\n\n--- START OF {os.path.basename(pdf)} ---\n\n"
    try:
        doc = fitz.open(pdf)
        for page in doc:
            all_text += page.get_text() + "\n"
    except Exception as e:
        all_text += f"Error reading {pdf}\n"

with open('all_pdfs_text.txt', 'w', encoding='utf-8') as f:
    f.write(all_text)
print("Done")
