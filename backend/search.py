from googlesearch import search
from bs4 import BeautifulSoup
import requests
import sys
import os

temp_file_path = 'temp_output.txt'

def google_search(query):
    try:
        results = search(query,lang="en")

        lines = []
        for i, result in enumerate(results, start=1):
            new_data = result
            lines.append(new_data)
            if i == 10:
                break
        try:
            for i in range(3):
                url = lines[i]
                response = requests.get(url)
                html_content = response.text

                soup = BeautifulSoup(html_content, 'html.parser')
                paragraphs = soup.find_all('p')
                for paragraph in paragraphs:
                    if(len(paragraph.text) > 50):
                        with open(temp_file_path, 'a') as temp_file:
                            temp_file.write(paragraph.text + '\n')
            
        except Exception as e:
            print(f"An error occured: {e}")

    except Exception as e:
        print(f"An error occurred: {e}")

search_query = sys.argv[1] if len(sys.argv) > 1 else "wikipedia"
google_search(search_query)

