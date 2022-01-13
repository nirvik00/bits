import nltk
# nltk.download()

from nltk.tokenize import sent_tokenize, word_tokenize

a="hello there Mr. NS what is going on? I am going out. The sky is blue."

print(sent_tokenize(a))

for i in word_tokenize(a):
    print(i)