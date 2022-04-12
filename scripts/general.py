import glob
from setup import *
from shutil import copyfile
from PIL import Image


def getFolderStructure():
    tmpFileList = list(Path(FOLDER_PATH).rglob("*." + ORIGINAL_FILETYPE))
    fileList = []
    for path in tmpFileList:
        fileList.append(str(path).split(os.sep))
    return fileList


def getFileList():
    return list(glob.glob(FOLDER_PATH + os.sep + "*." + ORIGINAL_FILETYPE))


def createCollection(collectionName, publishedStatus):
    sql = """ INSERT INTO publication_collection (name, published, project_id) VALUES(%s, %s, %s) RETURNING id"""
    values_to_add = (collectionName, publishedStatus, PROJECT_ID)
    cursor_new.execute(sql, values_to_add)
    colId = cursor_new.fetchone()[0]
    return colId


def createPublication(publicationCollectionId, publicationName, publishedStatus, publicationGenre):
    sql = """ INSERT INTO publication (publication_collection_id, name, published, genre) VALUES(%s, %s, %s, %s) RETURNING id"""
    values_to_add = (publicationCollectionId, publicationName, publishedStatus, publicationGenre)
    cursor_new.execute(sql, values_to_add)
    pubId = cursor_new.fetchone()[0]
    return pubId


def createFacsimileCollection(facsimileCollectionTitle, facsimileCollectionDescription):
    sql = """ INSERT INTO publication_facsimile_collection(title, number_of_pages, start_page_number, description) VALUES(%s, 1, 1, %s) RETURNING id"""
    values_to_add = (facsimileCollectionTitle, facsimileCollectionDescription)
    cursor_new.execute(sql, values_to_add)
    facsColId = cursor_new.fetchone()[0]
    return facsColId


def updateFacsimileCollection(facsColId, pageNumber):
    sql = """ UPDATE publication_facsimile_collection SET number_of_pages = %s WHERE id = %s"""
    values_to_add = (pageNumber, facsColId)
    cursor_new.execute(sql, values_to_add)
    

def createFacsimile(facsColId, pubId):
    sql = """ INSERT INTO publication_facsimile (publication_facsimile_collection_id, publication_id, page_nr, type, priority, section_id) VALUES(%s, %s, 0, 0, 1, 0) RETURNING id"""
    values_to_add = (facsColId, pubId)
    cursor_new.execute(sql, values_to_add)
    pubId = cursor_new.fetchone()[0]
    return pubId


def createFacsimileCollectionFolder(facsimileCollectionId):
    os.makedirs(os.path.dirname('facsimile_collections/' + str(facsimileCollectionId) + '/1/'), exist_ok=True)
    os.makedirs(os.path.dirname('facsimile_collections/' + str(facsimileCollectionId) + '/2/'), exist_ok=True)
    os.makedirs(os.path.dirname('facsimile_collections/' + str(facsimileCollectionId) + '/3/'), exist_ok=True)
    os.makedirs(os.path.dirname('facsimile_collections/' + str(facsimileCollectionId) + '/4/'), exist_ok=True)
    return None


def moveJPGToFacsimileCollectionFolder(originalPath, facsimileCollectionId, fileNumber):
    image = Image.open(str(originalPath))
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")
    image.save(str(originalPath).replace('.tif', '.jpg'))
    copyfile( str(originalPath).replace('.tif', '.jpg'), 'facsimile_collections/' + str(facsimileCollectionId) + '/1/' + fileNumber + '.jpg')
    image = Image.open('facsimile_collections/' + str(facsimileCollectionId) + '/1/' + fileNumber + '.jpg')
    resized_im = image.resize((round(image.size[0]*0.5), round(image.size[1]*0.5)))
    resized_im.save('facsimile_collections/' + str(facsimileCollectionId) + '/2/' + fileNumber + '.jpg',quality=90,optimize=True)
    resized_im = image.resize((round(image.size[0]*0.3), round(image.size[1]*0.3)))
    resized_im.save('facsimile_collections/' + str(facsimileCollectionId) + '/3/' + fileNumber + '.jpg',quality=90,optimize=True)
    resized_im = image.resize((round(image.size[0]*0.1), round(image.size[1]*0.1)))
    resized_im.save('facsimile_collections/' + str(facsimileCollectionId) + '/4/' + fileNumber + '.jpg',quality=90,optimize=True)
    return None

