import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
def func1():
    sentence = """At eight o'clock on Thursday morning Arthur didn't feel very good."""
    tokens = nltk.word_tokenize(sentence)
    print(tokens)
    tagged = nltk.pos_tag(tokens)
    print(tagged[0:6])

nltk.download('treebank')

from nltk.corpus import treebank
def func2():
    t = treebank.parsed_sents('wsj_0001.mrg')[0]
    t.draw()



from nltk import pos_tag
from nltk import RegexpParser
def func3():
    sentence= """Peter Blinken, 61 years old, will join the board as a non-executive director, Nov 29."""
    text= sentence.split()
    print("after split: ", text)
    tokens_tag = pos_tag(text)
    print("after tokenizer: ", tokens_tag)
    patterns= """mychunk:{<NN.?>*<VBD.?>*<CC>}"""
    chunker=RegexpParser(patterns)
    print("After Regex: ", chunker)
    output=chunker.parse(tokens_tag)
    print("after chunking: ", output)
    print(type(output))
    output.draw()

func3()

# func2()