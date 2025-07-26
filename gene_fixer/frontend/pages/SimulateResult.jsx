import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SimulateResult = () => {
    const { state } = useLocation();
    const [resultData, setResultData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!state) {
            navigate('/gene-fix');
            return;
        }

        const fetchSimulation = async () => {
            try {
                const res = await fetch('http://localhost:5000/gene-fix', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state),
                });
                const data = await res.json();
                setResultData(data);
            } catch (err) {
                console.error('Error during simulation fetch:', err);
            }
        };

        fetchSimulation();
    }, [state]);

    if (!resultData) return <div className="p-6">Running simulation...</div>;

    const {
        gene,
        mutation,
        mutation_type,
        repair,
        simulation,
        trials = [],
        ai_summary,
    } = resultData;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Simulation Results</h1>

            <div className="mb-6">
                <p><strong>Gene:</strong> {gene}</p>
                <p><strong>Mutation:</strong> {mutation}</p>
                <p><strong>Mutation Type:</strong> {mutation_type}</p>
                <p><strong>Repair Plan:</strong> {repair?.repair_type || 'N/A'}</p>
            </div>

            <div className="mb-6 bg-white shadow rounded p-4">
                <h2 className="text-2xl font-semibold mb-3">Simulation Details:</h2>
                <p><strong>Status:</strong> {simulation?.simulation_status}</p>
                <p><strong>Editing Efficiency:</strong> {simulation?.editing_efficiency}</p>
                <p><strong>On-Target Effects:</strong> {simulation?.on_target_effects}</p>
                <p><strong>Off-Target Effects:</strong> {simulation?.off_target_effects}</p>
            </div>

            <div>
                {ai_summary}
            </div>


            <div className="text-center">
                <button
                    onClick={() => navigate('/gene-fix')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                    Run Another Simulation
                </button>
            </div>
        </div>
    );
};

export default SimulateResult;
