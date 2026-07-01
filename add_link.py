import re

file_path = "/home/fabio/REQ-2026.1-T01-ProntoCare/docs/planejamento-organizacao/progresso-do-projeto.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

old_text = "Matriz de Dívida Técnica (ver seção 9.4 do DoD)."
new_text = "Matriz de Dívida Técnica ([ver seção 9.4 do DoD](../visao-produto/DoR-DoD.md#94-matriz-operacional-de-entregas-sem-pull-request))."

text = text.replace(old_text, new_text)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Link adicionado.")
