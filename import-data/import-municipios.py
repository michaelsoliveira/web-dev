import os
import pandas as pd
import chardet
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import psycopg2

load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# Detectar encoding do arquivo CSV
csv_path = os.path.join(os.getcwd(), "municipios.csv")
with open(csv_path, "rb") as f:
    result = chardet.detect(f.read(100000))  # Analisa os primeiros 100 KB
    encoding_detected = result["encoding"]

# Ler CSV com encoding correto
df = pd.read_csv(csv_path, sep=';', header=1, encoding='utf-8-sig')

# Renomear colunas
df.columns = ["id", "nome", "estado_id", "ibge", "lat_lon"]

# Lista de valores inválidos
valores_invalidos = ["S/B", "s/b", "S/N", "s/n", "null", "NULL", "N/A", "n/a", "-", "--", pd.NA, None]

# Substituir valores inválidos e preencher NaN
df.replace(valores_invalidos, "", inplace=True)
df.fillna("", inplace=True)

def to_wkt_point(latlon_str):
    try:
        lat, lon = latlon_str.strip("()").split(",")
        return f'POINT({lon.strip()} {lat.strip()})'
    except Exception:
        return None
    
df['lat_lon'] = df['lat_lon'].apply(to_wkt_point)

try:

    # Criar conexão com o banco PostgreSQL
    engine = create_engine(f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    with engine.connect() as connection:
        print("Iniciando a importação")
        
        with engine.begin() as conn:
            conn.execute(
                text("""
                INSERT INTO municipio (id, nome, estado_id, ibge, lat_lon)
                VALUES (:id, :nome, :estado_id, :ibge, :lat_lon)
                """),
                df.to_dict(orient="records")
            )

except Exception as e:
    print("Erro tentando realizar a conexão com banco de dados: ", e)