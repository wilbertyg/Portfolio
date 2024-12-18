import guarjian from '../../assets/guarjian.png';
import sentimentAnalysis from '../../assets/sentiment.png';
import monkeyPoxPredictorGUI from '../../assets/monkey_pox_predictor_GUI.png';

export const ProjectList = [
    {
        title: 'Monkeypox Predictor Model',
        description: 'A model that can predict if a person has a monkepox or not from the given symptoms using XGBoost, SVC, and Logistic Regression model.',
        image: monkeyPoxPredictorGUI,
        url: 'https://github.com/wilbertyg/monkey-pox-prediction',
        btnText: 'View Project',
        btnEnabled: true,
    },
    {
        title: 'Speaker Recognition System',
        description: 'A speaker recognition system that can identify the person behind the voice using RNN, XGBoost, and SVC model.',
        image: 'https://partner.phonexia.com/wp-content/uploads/2018/03/speaker_identification-300x215.png',
        url: 'https://github.com/wilbertyg/speaker-recognition',
        btnText: 'View Project',
        btnEnabled: true,
    },
    {
        title: 'Sentiment Analysis on Online Shopping Store Product by Product Review',
        description: 'A sentiment analysis model for classifying user sentiment to product using BERT and XGBoost.',
        image: sentimentAnalysis,
        url: 'https://github.com/wilbertyg/sentiment-analysis-amazon',
        btnText: 'View Project',
        btnEnabled: true,
    },
    {
        title: 'GuarJIan',
        description: 'A healthcare shopping website coded in pure HTML, CSS, and JavaScript.',
        image: guarjian,
        url: 'https://github.com/wilbertyg/GuarJIan',
        btnText: 'View Project',
        btnEnabled: true,
    },
]