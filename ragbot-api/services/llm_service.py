from llama_index.llms.openai import OpenAI
from llama_index.llms.mistralai import MistralAI
from config import LLM_PROVIDER, OPENAI_API_KEY, MISTRAL_API_KEY, OPENAI_MODEL, MISTRAL_MODEL

def get_llm():
    """
        Returns the LLM instance based on the provider
    """
    if LLM_PROVIDER.lower() == "openai":
        return OpenAI(model=OPENAI_MODEL, api_key=OPENAI_API_KEY)
    elif LLM_PROVIDER.lower() == "mistral":
        return MistralAI(model=MISTRAL_MODEL, api_key=MISTRAL_API_KEY)
    else:
        raise ValueError("Invalid LLM Provider")