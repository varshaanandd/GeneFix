import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GetGene() {
  const [form, setForm] = useState({
    gene: 'TP53',
    mutation: 'p.R175H',
    mutation_type: 'Missense',
    disease_association: 'Li-Fraumeni Syndrome',
    mutation_impact: 'Deleterious',
    mutation_frequency: 'High',
    gene_function: 'Tumor Suppressor',
    family_history: 'Yes',
    enzyme: 'Cas9',
    pam: 'NGG',
    grna: 'GAGGAGGGGGAGGAG',
    action: 'analyze'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/gene-fix', form);
      
      // Change navigate URL based on the chosen action
      if (form.action === 'analyze') {
        navigate('/result', { state: res.data });
      } else if (form.action === 'simulate') {
        navigate('/simulate', { state: res.data });
      } else if (form.action === 'live_simulation') {
        navigate('/live-simulate', { state: res.data });
      }
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const renderSelect = (label, name, options) => (
    <div>
      <label htmlFor={name} className="block font-medium">{label}</label>
      <select
        name={name}
        id={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
        required
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">🧬 GeneFixer - Enter Mutation Details</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {renderSelect("Gene Name", "gene", ["TP53", "KRAS", "EGFR", "BRCA1", "BRCA2", "APC", "MLH1", "CDKN2A", "PTEN", "MUTYH"])}
        {renderSelect("Mutation (HGVS format)", "mutation", ["p.R175H", "p.G12D", "p.G12C", "p.G13D", "p.L858R", "p.T790M", "p.R2336W", "p.E746_A750del", "p.H1047R", "p.E545K", "p.W1616X", "p.R2216X", "p.R130Q", "p.P16Leu146Pro", "p.G129E", "p.R265W"])}
        {renderSelect("Mutation Type", "mutation_type", ["Missense", "Nonsense", "Insertion", "Deletion"])}
        {renderSelect("Disease Association", "disease_association", ["Li-Fraumeni Syndrome", "Breast Cancer, Lung Cancer", "Pancreatic Cancer", "Ovarian Cancer, Breast Cancer", "Hereditary Breast Cancer", "Non-Small Cell Lung Cancer", "Colorectal Cancer", "Familial Adenomatous Polyposis", "Hereditary Nonpolyposis Colorectal Cancer", "Melanoma, Pancreatic Cancer", "Cowden Syndrome", "MUTYH-Associated Polyposis"])}
        {renderSelect("Mutation Impact", "mutation_impact", ["Deleterious", "Neutral"])}
        {renderSelect("Mutation Frequency", "mutation_frequency", ["High", "Medium", "Low"])}
        {renderSelect("Gene Function", "gene_function", ["Tumor Suppressor", "Oncogene", "DNA Repair Gene"])}
        {renderSelect("Family History", "family_history", ["Yes", "No", "Unknown"])}
        {renderSelect("CRISPR Enzyme", "enzyme", ["Cas9", "Cpf1", "C2c2"])}
        {renderSelect("PAM Sequence", "pam", ["NGG", "NGA", "NGCG", "NGAG"])}
        {renderSelect("gRNA Sequence", "grna", ["GAGGAGGGGGAGGAG", "GAGGAGGGAGAGGAGG", "TGGAGAGGGAGGAGG", "GAGGGAGGAGGGAG", "CTCGAGGAAGGAAGG", "AGGAGGAGGGAGGAG"])}

        <div className="flex gap-2">
          {["analyze", "simulate", "live_simulation"].map((actionType) => (
            <button
              key={actionType}
              type="submit"
              name="action"
              value={actionType}
              onClick={() => setForm((f) => ({ ...f, action: actionType }))}
              className={`flex-1 py-2 px-3 rounded text-white ${
                actionType === "analyze"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : actionType === "simulate"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              {loading && form.action === actionType
                ? "Loading..."
                : actionType === "analyze"
                ? "🧪 Analyze"
                : actionType === "simulate"
                ? "🔬 Simulate"
                : "⚡ Live Sim"}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

export default GetGene;
