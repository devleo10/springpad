from langchain_community.document_loaders import WebBaseLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

url = 'https://www.moneycontrol.com/mutual-funds/performance-tracker/returns/large-cap-fund.html'

loader = WebBaseLoader(url)

parser = StrOutputParser()

prompt = PromptTemplate(
    template='I ask you question based on the following text: {text} question: {question}',
    input_variables=['question','text']
)

chain = prompt | model | parser

print("Loading documents...")
docs = loader.load()
print(f"Documents loaded: {len(docs)}")
print(f"First document content length: {len(docs[0].page_content)}")

print("Invoking chain...")
result = chain.invoke({'question':'Display the 5 top performing funds in a json format','text':docs[0].page_content})
print("Chain invoked successfully")

print("Result:")
print(result)

# Write output to file
with open('output_result.txt', 'w', encoding='utf-8') as f:
    f.write(f"Documents loaded: {len(docs)}\n")
    f.write(f"First document content length: {len(docs[0].page_content)}\n")
    f.write(f"Result:\n{result}\n")
