import re

file_path = "/home/fabio/REQ-2026.1-T01-ProntoCare/docs/planejamento-organizacao/progresso-do-projeto.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

old_text = "> **Percentual de Conclusão do MVP:** Das 22 USs planejadas, 100% possuem evidências claras de rastreabilidade (Issues/PRs), software validado funcionalmente pelo Product Owner (Dr. Rogério Duarte) e métricas integradas de QA, atingindo **100% de conclusão do MVP letivo.**"
new_text = "> **Percentual de Conclusão do MVP:** Das 22 USs planejadas, atingimos **100% de conclusão do MVP letivo** com software validado funcionalmente pelo Product Owner (Dr. Rogério Duarte). Deste montante, apenas 6 USs seguiram o fluxo formal obrigatório de Issues/PRs (US08, 10, 11, 12, 13 e 15), enquanto as demais 16 USs foram entregues via *commits diretos (main)* justificados na Matriz de Dívida Técnica (ver seção 9.4 do DoD)."

text = text.replace(old_text, new_text)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Texto de rastreabilidade corrigido.")
