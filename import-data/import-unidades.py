import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy import insert, text

load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# Conecte ao seu banco PostgreSQL (ajuste os dados de acesso)
engine = create_engine(f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
directory_path = os.getcwd()
df = pd.read_csv(os.path.join(directory_path, "relacao_escolar.csv"), sep=';', header=1)

municipios = []

with engine.connect() as conn:
    result = conn.execute(text("SELECT id, nome FROM municipio where estado_id = 4"))
    municipios = [{'id': m.id, 'nome': m.nome} for m in result]

def findMunicipioId(nome):
    for m in municipios:
        if m['nome'].lower() == nome.lower():
            return m['id']
    return None

# Carrega os dados

df.columns = [
    "id", "municipio", "zona", "inep", "unidade", "logradouro", "numero", "complemento", "bairro", "cep", "estado_id", "municipio_id"
]

# Lista de valores considerados inválidos
valores_invalidos = ["S/B", "s/b", "S/N", "s/n", "null", "NULL", "N/A", "n/a", "-", "--", pd.NA, None]

# Substituir todos os valores inválidos por string vazia
df.replace(valores_invalidos, "", inplace=True)

df.fillna("", inplace=True)

# Função para inserir uma linha
def inserir_dados(row):
    with engine.begin() as conn:
        # 1. Inserir endereço
        result = conn.execute(
            text("""
            INSERT INTO endereco (logradouro, numero, complemento, bairro, cep, municipio_id, estado_id)
            VALUES (:logradouro, :num, :comp, :bairro, :cep, :municipio, :uf)
            RETURNING id
            """),
            { 
                "logradouro": row.logradouro, 
                "num": row.numero, 
                "comp": row.complemento, 
                "bairro": row.bairro, 
                "cep": row.cep, 
                "municipio": findMunicipioId(row.municipio), 
                "uf": 4
            }
        )
        endereco_id = result.scalar()
        
        # 2. Inserir pessoa (tipo F)
        result = conn.execute(
            text("""
            INSERT INTO pessoa (tipo, endereco_id)
            VALUES ('J', :endereco)
            RETURNING id
            """),
            { "endereco": endereco_id }
        )
        pessoa_id = result.scalar()
        
        # 3. Inserir pessoa_fisica
        conn.execute(
            text("""
            INSERT INTO pessoa_juridica (pessoa_id, nome_fantasia)
            VALUES (:pessoa, :nome)
            """),
            { "pessoa": pessoa_id, "nome": row.unidade }
        )
        
        # 4. Inserir unidade_escolar
        conn.execute(
            text("""
            INSERT INTO unidade_escolar (inep, zona, pessoa_id)
            VALUES (:inep, :zona, :pessoa)
            """),
            { "inep": row.inep, "zona": row.zona.lower(), "pessoa": pessoa_id }
        )
        
# Aplicar para cada linha
df.apply(inserir_dados, axis=1)
