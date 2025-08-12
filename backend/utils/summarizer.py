def summarize(text):
    # simple: return first 2 sentences
    sentences = text.split('.')
    summary = '. '.join(sentences[:2]) + '.'
    return summary
