from pymongo import MongoClient
import json

f = open('../../data/questions.json', 'r')
data = json.load(f)
f.close()


client = MongoClient('mongodb://localhost:27017/')
db = client['radio']

for question in data:
    try:
        fcc_section = question['FCC_section']
    except KeyError:
        fcc_section = None
    q_id = db.questions.insert_one({
        'body': question['question'],
        'correctAnswer': question['correct_answer'],
        'questionNumber': question['question_number'],
        'section': question['section'],
        'subSection': question['sub_section'],
        'fccSection': fcc_section,
        'licenseType': question['license_type']
    }).inserted_id

    for letter, answer in question['answers'].iteritems():
        a_id = db.answers.insert_one({
            'body': answer,
            'letter': letter,
            'question': q_id
        }).inserted_id

        if letter == question['correct_answer']:
            db.questions.update({
                '_id': q_id
            },{
                '$set': {
                    'correctAnswer': a_id
                }
            }, upsert=False)

