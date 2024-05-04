import pandas as pd
from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    # Load and process the CSV data
    df = pd.read_csv('top_grossing_movies_2023.csv')
    # Convert 'Release Date' to datetime and extract the month
    df['Month'] = pd.to_datetime(df['Release Date']).dt.month
    df['2023 Gross'] = df['2023 Gross'].replace('[\$,]', '', regex=True).astype(float)

    # Aggregate data by Genre and Month
    heatmap_data = df.groupby(['Genre', 'Month'])['2023 Gross'].sum().unstack(fill_value=0)

    # Load the treemap data from JSON
    with open('top_grossing_movies_2023.json', 'r', encoding='utf-8') as file:
        treemap_data = json.load(file)
        
    with open('sankey_data.json', 'r', encoding='utf-8') as file:
        sankey_data = json.load(file)

    genres = [genre['name'] for genre in treemap_data['children']]  # Extract genre names

    # Convert DataFrame to a JSON format that the frontend can easily consume
    heatmap_data_json = heatmap_data.to_json()

    print(json.dumps(sankey_data))
    return render_template('index.html', treemap_data=json.dumps(treemap_data), sankey_data=json.dumps(sankey_data),
                           heatmap_data=heatmap_data_json, genres=genres)
    

if __name__ == '__main__':
    app.run(debug=True)
