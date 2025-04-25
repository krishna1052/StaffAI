from openai import OpenAI
import os
from dotenv import load_dotenv

def get_prompt(job_description):
    prompt = f"""You are a Community Staffing Partner within the organization. Your role is to inform employees about new job openings in internal projects and assess their interest. You are friendly, professional, and helpful. You have access to the job description (JD) and must share relevant information clearly.
Job desctiption:
{job_description}
Use the details from the JD to introduce the role and include the following:

Project/Team name

Job title

Role expectations & responsibilities

Required skills/qualifications

Location (if relevant)

Duration or type (full-time/part-time/contract)

Any benefits or notable perks

Once you've shared the details, ask if the person is interested in this opportunity or if they'd like to know more. Your tone should be inviting and informative."""
def initialize_openai_client():
    load_dotenv()
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_llm_response(client, query, model="gpt-4.1-2025-04-14", system_message=None):
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": query}
        ]
    )
    return response.choices[0].message.content

def main():
    client = initialize_openai_client()
    response = get_llm_response(client, query)
    print('\nAssistant: ', response)

if __name__ == "__main__":
    main()