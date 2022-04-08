import os
import xml.etree.ElementTree as ET
import logging
from setup import *
from general import *

logging.basicConfig(filename="folder2publication.txt",
                level=logging.DEBUG,
                format='%(levelname)s: %(asctime)s %(message)s',
                datefmt='%m/%d/%Y %I:%M:%S')

# Get the folder structure, path defined in .env
if PUBLICATION_ID is None:
    paths = getFolderStructure()
else:
    paths = getFileList()

previousPublicationName = None
previousFacsimileCollectionId = None
previousCollectionName = None
previousCollectionId = None
# Loop through the files, extract the folders and file names
for path in paths:
    if PUBLICATION_ID is None:
        fullPath = str(os.sep).join(path)
        fileName = path[len(path) - 1]
        # If we want to create a new publication per file (e.g. Söderhom)
        if PER_FILE_PUBLICATION:
            collectionName = path[len(path) - 2]
            publicationName = str(fileName).split('.')[0]
        else:
            collectionName = path[len(path) - 3]
            publicationName = path[len(path) - 2]
    else:
        fullPath = path
        splitPath = str(path).split(os.sep)
        collectionName = splitPath[len(splitPath) - 3]
        publicationName = splitPath[len(splitPath) - 2]
        fileName = splitPath[len(splitPath) - 1]
    
    if PUBLICATION_COLLECTION_ID is None and (previousCollectionName is None or previousCollectionName != collectionName):
        # Create collection, use the same name as for publication
        colId = createCollection(publicationName, PUBLICATION_STATUS)
        logging.info('Added collection id ' + str(colId) + ": " + publicationName + " - " + fileName)
        previousCollectionName = collectionName
        previousCollectionId = colId
    else:
        if PUBLICATION_COLLECTION_ID is None:
            colId = previousCollectionId
        else:
            colId = PUBLICATION_COLLECTION_ID
    
    # Get the file number (page number) from the filename. 
    # The fileNumber algorithm should have a fail over...
    fileNumber = fileName.split('_')[-1]
    # Removes non numeric characters and strips leading zeroes to get file number
    fileNumber = re.sub('^0+', '', (re.sub('\D', '', fileNumber)))
    
    # Only create a new publication if the publication name changes
    if previousPublicationName is None or previousPublicationName != publicationName:
        # Check if we already have a publication name
        if PUBLICATION_ID is None:
            # Creates one Collection for each folder
            pubId = createPublication(colId, publicationName, PUBLICATION_STATUS, PUBLICATION_GENRE)
            logging.info('Added publication id ' + str(pubId) + ": " + publicationName + " - " + fileName)
        else:
            pubId = PUBLICATION_ID
            logging.info('Using old publication id ' + str(pubId) + ": " + publicationName + " - " + fileName)
        
        # Create the Facsimile Collection
        facsColId = createFacsimileCollection(publicationName, collectionName + " - " + publicationName)
        logging.info('Added FacsimileCollection id ' + str(facsColId) + ": " + collectionName + " - " + publicationName)
        
        # Create the Facsimile, connect it to the Publication and Collection
        createFacsimile(facsColId, pubId)
        logging.info('Added Facsimile')
        
        previousFacsimileCollectionId = facsColId
        previousPublicationName = publicationName
    
    if previousPublicationName is not None:
        # If we create a new publication for each file, the number will always be 1
        if PER_FILE_PUBLICATION:
            fileNumber = '1'
        # Update number of pages for collection
        updateFacsimileCollection(previousFacsimileCollectionId, fileNumber)
        # Create the folder
        createFacsimileCollectionFolder(previousFacsimileCollectionId)
        moveJPGToFacsimileCollectionFolder(fullPath, previousFacsimileCollectionId, fileNumber)
    else:
        logging.error('Publication name or id missing')
    
    conn_new_db.commit()

conn_new_db.close()