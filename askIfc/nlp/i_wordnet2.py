from nltk.corpus import wordnet

# semantic similarity

w1 = wordnet.synset("ship.n.01")
w2 = wordnet.synset("c.n.01")

print(w1.wup_similarity(w2))


w1 = wordnet.synset("ship.n.01")
w2 = wordnet.synset("car.n.01")

print(w1.wup_similarity(w2))


w1 = wordnet.synset("ship.n.01")
w2 = wordnet.synset("cactus.n.01")

print(w1.wup_similarity(w2))