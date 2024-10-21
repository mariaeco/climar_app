import numpy as np
import json


# Abrir o arquivo JSON
with open('c:/Users/maria/Downloads/average_season_city.json', 'r') as file:
    medias_cidades = json.load(file)

# Exibir o conteúdo do JSON
print(medias_cidades)

city = 'Honolulu'
# Função para gerar dados meteorológicos mensais com base na cidade e estação
def gerar_dados_por_mes(cidade):
    dados = []
    
    for mes in range(1, 11):
        if mes in [12, 1, 2]:  # Inverno
            estacao = "Inverno"
        elif mes in [3, 4, 5]:  # Primavera
            estacao = "Primavera"
        elif mes in [6, 7, 8]:  # Verão
            estacao = "Verao"
        elif mes in [10]: 
            estacao = "Outono"
        
        media = medias_cidades[cidade][estacao]

        temperatura = np.random.normal(media["temperatura"], 1)  # Com base na média da cidade
        precipitacao = np.random.normal(media["precipitacao"], 5)
        umidade = np.random.normal(media["umidade"], 5)
        mare_alta = np.random.normal(media["mare_alta"], 0.1)

        dados.append({
            "mes": mes,
            "temperatura": round(temperatura, 2),
            "precipitacao": round(precipitacao, 2),
            "umidade": round(umidade, 2),
            "mare_alta": round(mare_alta, 2)
        })
    
    return dados

# Função para gerar dados para 5 anos
def gerar_dados_por_ano(cidade, anos=10):
    dados_anuais = {}
    
    for ano in range(2013, 2013 + anos):
        dados_anuais[str(ano)] = gerar_dados_por_mes(cidade)
    
    return dados_anuais

# Exemplo: Gerando dados para Amsterdam
dados_mensais = gerar_dados_por_mes(city)

dados_anuais = gerar_dados_por_ano(city, 10)


# Salvando como JSON
with open(f'c:/Users/maria/Downloads/historic_last_year_{city}.json', 'w') as f:
    json.dump({"dados_mensais": dados_mensais}, f, indent=4)

with open(f'c:/Users/maria/Downloads/historic_10_years_{city}.json', 'w') as f:
    json.dump(dados_anuais, f, indent=4)
print("Dados salvos como JSON!")