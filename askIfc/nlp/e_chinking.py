import nltk
from nltk.corpus import state_union
from nltk.tokenize import PunktSentenceTokenizer


train_text = state_union.raw("2005-GWBush.txt")
sample_text = state_union.raw("2006-GWBush.txt")

custom_sent_tokenizer  = PunktSentenceTokenizer(sample_text)

tokenized = custom_sent_tokenizer.tokenize(sample_text)

def process_content():
    count=0
    try:
        for i in tokenized:
            count+=1
            words = nltk.word_tokenize(i)
            tagged = nltk.pos_tag(words)
            # print(tagged)

            chunkgram = r"""Chunk: {<.*>+}
                                    }<VB.?|IN|DT>{"""
            chunkParser = nltk.RegexpParser(chunkgram);
            chunked=chunkParser.parse(tagged)
            print(chunked)
            chunked.draw()
            break


    except:
        pass

process_content()