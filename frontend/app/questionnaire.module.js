// Convert CSS to React Native styles
const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#d32f2f',
  },
  predictionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionContent: {
    flexDirection: 'column',
  },
  mainPrediction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  confidence: {
    marginTop: 5,
  },
  alternatives: {
    marginTop: 15,
  },
  finalResults: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finalPrediction: {
    marginBottom: 15,
  },
  symptomsList: {
    marginBottom: 15,
  },
  recommendations: {
    marginBottom: 15,
  },
  urgent: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  urgentText: {
    color: 'red',
  },
  urgentStrong: {
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  restartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  symptomSection: {
    marginBottom: 20,
  },
  symptomButtons: {
    marginBottom: 15,
  },
  symptomButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  symptomButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  denyButton: {
    backgroundColor: '#f44336',
  },
  symptomButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loading: {
    alignItems: 'center',
    marginVertical: 15,
  },
  noMoreSymptoms: {
    alignItems: 'center',
    marginVertical: 15,
  },
  getMoreButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  getMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  currentSymptoms: {
    marginBottom: 20,
  },
  finalizeButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  finalizeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
};

export default styles; 