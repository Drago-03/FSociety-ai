const express = require('express');
const { LanguageServiceClient } = require('@google-cloud/language');
const fetch = require('node-fetch');
const cors = require('./middleware/cors');
const monitoringRoutes = require('./routes/monitoring');

const app = express();
const client = new LanguageServiceClient();

app.use(cors);
app.use(express.json());

// Monitoring routes for web scanning and social media
app.use('/api/monitoring', monitoringRoutes);

const TOXICITY_THRESHOLD = 0.7;
const NEGATIVE_SENTIMENT_THRESHOLD = -0.3;

app.post('/api/content/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };

    const [sentiment] = await client.analyzeSentiment({ document });
    const [classification] = await client.classifyText({ document });
    
    const sentimentScore = sentiment.documentSentiment?.score || 0;
    const categories = classification.categories?.map(category => category.name || '') || [];
    
    const hasHarmfulContent = categories.some(category => 
      category.toLowerCase().includes('adult') || 
      category.toLowerCase().includes('offensive') || 
      category.toLowerCase().includes('violence') ||
      category.toLowerCase().includes('hate') ||
      category.toLowerCase().includes('threat')
    );
    
    const toxicityScore = Math.min(1, Math.max(0,
      hasHarmfulContent ? 0.8 :
      sentimentScore < NEGATIVE_SENTIMENT_THRESHOLD ? Math.abs(sentimentScore) :
      categories.some(c => c.toLowerCase().includes('negative')) ? 0.6 :
      0.2
    ));
    
    const flags = {
      adult: categories.some(c => c.toLowerCase().includes('adult')),
      spam: categories.some(c => c.toLowerCase().includes('spam') || c.toLowerCase().includes('advertisement')),
      hate: categories.some(c => c.toLowerCase().includes('hate') || sentimentScore < -0.7),
      harassment: categories.some(c => c.toLowerCase().includes('threat') || c.toLowerCase().includes('offensive')) || sentimentScore < -0.6
    };

    res.json({
      toxicity: toxicityScore,
      sentiment: sentimentScore,
      categories,
      flags
    });
  } catch (error) {
    console.error('Error analyzing content:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
  }
});

app.post('/api/content/analyze-batch', async (req, res) => {
  try {
    const { texts } = req.body;
    const results = await Promise.all(texts.map(async (text) => {
      try {
        const document = {
          content: text,
          type: 'PLAIN_TEXT',
        };

        const [sentiment] = await client.analyzeSentiment({ document });
        const [classification] = await client.classifyText({ document });
        
        const sentimentScore = sentiment.documentSentiment?.score || 0;
        const categories = classification.categories?.map(category => category.name || '') || [];
        
        const hasHarmfulContent = categories.some(category => 
          category.toLowerCase().includes('adult') || 
          category.toLowerCase().includes('offensive') || 
          category.toLowerCase().includes('violence') ||
          category.toLowerCase().includes('hate') ||
          category.toLowerCase().includes('threat')
        );
        
        const toxicityScore = Math.min(1, Math.max(0,
          hasHarmfulContent ? 0.8 :
          sentimentScore < NEGATIVE_SENTIMENT_THRESHOLD ? Math.abs(sentimentScore) :
          categories.some(c => c.toLowerCase().includes('negative')) ? 0.6 :
          0.2
        ));
        
        const flags = {
          adult: categories.some(c => c.toLowerCase().includes('adult')),
          spam: categories.some(c => c.toLowerCase().includes('spam') || c.toLowerCase().includes('advertisement')),
          hate: categories.some(c => c.toLowerCase().includes('hate') || sentimentScore < -0.7),
          harassment: categories.some(c => c.toLowerCase().includes('threat') || c.toLowerCase().includes('offensive')) || sentimentScore < -0.6
        };

        return {
          toxicity: toxicityScore,
          sentiment: sentimentScore,
          categories,
          flags
        };
      } catch (error) {
        console.error('Error in batch analysis:', error);
        return null;
      }
    }));
    
    res.json(results.filter(result => result !== null));
  } catch (error) {
    console.error('Error in batch analysis:', error);
    res.status(500).json({ error: 'Failed to analyze content batch' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});