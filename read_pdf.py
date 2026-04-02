import fitz 

try:
    doc = fitz.open("src/assets/catalogs/rda-wires-cables.pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    
    with open("pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Done")
except Exception as e:
    print(e)
