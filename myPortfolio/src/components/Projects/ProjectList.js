import guarjian from '../../assets/project_guarjian.png';
import sentimentAnalysis from '../../assets/project_sentiment_analysis.png';
import monkeyPoxPredictorGUI from '../../assets/project_monkey_pox_predictor_GUI.png';
import speakerRecognition from '../../assets/project_speaker_identification.png';

export const ProjectList = [
    {
        id: 'monkeypox-predictor',
        title: 'Monkeypox Predictor Model',
        category: 'Machine Learning',
        description: 'Predictive diagnostic model that assesses monkeypox likelihood from clinical symptom vectors using ensemble classifiers and logistic regression.',
        image: monkeyPoxPredictorGUI,
        url: 'https://github.com/wilbertyg/monkey-pox-prediction',
        tags: ['Python', 'XGBoost', 'SVC', 'Logistic Regression', 'Scikit-Learn'],
        btnText: 'View Repository',
        btnEnabled: true,
    },
    {
        id: 'speaker-recognition',
        title: 'Speaker Recognition System',
        category: 'Deep Learning',
        description: 'Biometric voice identification engine that classifies speaker identity through recurrent neural networks and acoustic feature extraction.',
        image: speakerRecognition,
        url: 'https://github.com/wilbertyg/speaker-recognition',
        tags: ['Python', 'RNN', 'Audio DSP', 'XGBoost', 'SVC'],
        btnText: 'View Repository',
        btnEnabled: true,
    },
    {
        id: 'sentiment-analysis',
        title: 'E-Commerce Sentiment Analysis',
        category: 'NLP & Transformers',
        description: 'Fine-tuned natural language classifier using BERT representations paired with gradient boosting to categorize multi-class customer sentiment from reviews.',
        image: sentimentAnalysis,
        url: 'https://github.com/wilbertyg/sentiment-analysis-amazon',
        tags: ['Python', 'BERT', 'Transformers', 'XGBoost', 'NLP'],
        btnText: 'View Repository',
        btnEnabled: true,
    },
    {
        id: 'guarjian',
        title: 'GuarJIan Healthcare Platform',
        category: 'Web Development',
        description: 'Responsive healthcare pharmaceutical e-commerce interface featuring dynamic product filtering, cart management, and interactive UI.',
        image: guarjian,
        url: 'https://github.com/wilbertyg/GuarJIan',
        tags: ['JavaScript', 'HTML5', 'CSS3', 'Responsive Design'],
        btnText: 'View Repository',
        btnEnabled: true,
    },
]