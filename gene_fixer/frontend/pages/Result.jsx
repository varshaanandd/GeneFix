// Result.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DualProteinViewer from '../components/DualProteinViewer ';

const Result = () => {
    const { state } = useLocation(); // state contains the mutation-related inputs from the previous step
    const [resultData, setResultData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!state) return;

        const fetchResults = async () => {
            const response = await fetch('http://localhost:5000/gene-fix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(state),
            });

            if (response.ok) {
                const data = await response.json();
                setResultData(data);
            } else {
                console.error('Error fetching data');
            }
        };

        fetchResults();
    }, [state]);

    if (!resultData) {
        return <div className="p-6">Loading results...</div>;
    }

    const { gene, mutation, mut_type, repair, trials, wild_url, mutated_url } = resultData;
    const wildTypeUrl = wild_url || "http://localhost:5000/static/TP53/TP53_wild.pdb";
    const mutantUrl = mutated_url || "http://localhost:5000/static/TP53/p.R175H/TP53_pr175h_missense.pdb";

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Mutation Report: {gene} – {mutation}</h2>
            <h3 className="text-lg font-semibold mb-4">Mutation Type: {mut_type}</h3>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h4 className="text-xl font-bold mb-4">Protein Structure Comparison</h4>
                <DualProteinViewer
                    wildTypePdbUrl={wildTypeUrl}
                    mutantPdbUrl={mutantUrl}
                    wildTypeLabel={`${gene} Wild Type`}
                    mutantLabel={`${gene} ${mutation} (${mut_type})`}
                />
                <p className="text-sm text-gray-600 mt-2">
                    Use the slider to transition between wild type and mutant protein structures.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-bold mb-4">CRISPR Repair Plan</h4>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">{repair || 'No CRISPR repair plan available.'}</pre>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-bold mb-4">Clinical Trials</h4>
                    {trials && trials.length > 0 ? (
                        <div className="space-y-3 overflow-auto max-h-60">
                            {trials.map((t, i) => (
                                <div key={i} className="bg-gray-50 p-3 rounded shadow-sm">
                                    <p><strong>Condition:</strong> {t.Condition}</p>
                                    <p><strong>Status:</strong> {t.Status}</p>
                                    <p><strong>Title:</strong> {t["Study Title"]}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No clinical trials available.</p>
                    )}
                </div>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={() => navigate('/gene-fix')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition shadow"
                >
                    Try Another Mutation
                </button>
            </div>
        </div>
    );
};

export default Result;
