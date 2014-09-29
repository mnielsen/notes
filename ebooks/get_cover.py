"""
get_cover.py
~~~~~~~~~~~~

Script to simplify inserting Kindle pages into my webpage.
"""

# Standard library
import json 
from StringIO import StringIO
import urllib2

# Third-party libraries
from PIL import Image


link_url = raw_input("URL for the book: ")
image_url = raw_input("URL for the cover image: ")
img = Image.open(StringIO(urllib2.urlopen(image_url).read()))
filename = "images/%s.jpg" % abs(hash(link_url))
img.save(filename)
index = json.load(open("index.json"))
index.append({"link_url": link_url, 
              "file": filename})
json.dump(index, open("index.json", "w"))

# git commit and deploy

