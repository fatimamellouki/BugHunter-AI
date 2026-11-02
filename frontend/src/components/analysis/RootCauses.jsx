export default function RootCauses({ causes }) {
  if (causes.length === 0) return null;
  return (
    <div className="root-causes">
      <h3>Root causes suggested by the AI</h3>
      <ul>
        {causes.map((cause) => (
          <li key={cause}>{cause}</li>
        ))}
      </ul>
    </div>
  );
}
