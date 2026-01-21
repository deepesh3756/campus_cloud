const UserWelcome = ({ name }) => {
  return (
    <div className="mb-4">
      <h2 className="fw-bold">Welcome, {name} !</h2>
      <p className="text-muted">
        Here's a quick overview of your academic progress today.
      </p>
    </div>
  );
};

export default UserWelcome;
