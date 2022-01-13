from nltk.corpus import wordnet

# synonym = syns
syns = wordnet.synsets("program")

# synset
print(syns[0])

# word
print(syns[0].lemmas()[0].name())


# definition
print(syns[0].definition())

# examples
print(syns[0].examples())

synonyms=[]
antonyms =[]

for syn in wordnet.synsets("good"):
    for l in syn.lemmas():
        print("l: ", l)
        synonyms.append(l.name())
        if l.antonyms():
            antonyms.append(l.antonyms()[0].name())


print(set(synonyms))
print(set(antonyms))