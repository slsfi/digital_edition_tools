import sys, os, re
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

load_dotenv()

# Set global parameters
if len(sys.argv)>1 and re.search("^[0-9]{1,5}$", sys.argv[1]):
    PUBLICATION_COLLECTION_ID = sys.argv[1]
else:
    print('ERROR: PUBLICATION_COLLECTION_ID needs to be given as first argument')
    exit()
    
    # Set global parameters
if len(sys.argv)>2 and re.search("^[0-9]{1,5}$", sys.argv[2]):
    PUBLICATION_ID = sys.argv[2]
else:
    PUBLICATION_ID = None

if os.getenv("FOLDER_PATH") is None:
    print('ERROR: FOLDER_PATH needs to be given in .env file')
else:
    FOLDER_PATH = os.getenv("FOLDER_PATH")
    
if os.getenv("ORIGINAL_FILETYPE") is None:
    print('ERROR: ORIGINAL_FILETYPE needs to be given in .env file')
else:
    ORIGINAL_FILETYPE = os.getenv("ORIGINAL_FILETYPE")
    
if os.getenv("PUBLICATION_GENRE") is None:
    print('ERROR: PUBLICATION_GENRE needs to be given in .env file')
else:
    PUBLICATION_GENRE = os.getenv("PUBLICATION_GENRE")
    
if os.getenv("PUBLICATION_STATUS") is None:
    print('ERROR: PUBLICATION_STATUS needs to be given in .env file')
else:
    PUBLICATION_STATUS = os.getenv("PUBLICATION_STATUS")
    
if os.getenv("DB_USER") is None:
    print('ERROR: DB_USER needs to be given in .env file')
    exit()

if os.getenv("DB_PASSWORD") is None:
    print('ERROR: DB_PASSWORD needs to be given in .env file')
    exit()

if os.getenv("DB_DATABASE") is None:
    print('ERROR: DB_DATABASE needs to be given in .env file')
    exit()

if os.getenv("DB_PORT") is None:
    print('ERROR: DB_PORT needs to be given in .env file')
    exit()
    
if os.getenv("DB_HOST") is None:
    print('ERROR: DB_HOST needs to be given in .env file')
    exit()

conn_new_db = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_DATABASE"),
    user=os.getenv("DB_USER"),
    port=os.getenv("DB_PORT"),
    password=os.getenv("DB_PASSWORD")
)

cursor_new = conn_new_db.cursor()