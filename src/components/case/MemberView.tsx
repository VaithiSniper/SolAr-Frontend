export function MemberView() {

  const members = [
    {
      username: "Judge1",
      role: "Judge",
      group: "Prosecutor",
      x: 100,
      y: 100,
      connections: [
        { x: 200, y: 200 }, // Example connection to another member
        // Add more connections as needed
      ]
    },
    {
      username: "Lawyer1",
      role: "Lawyer",
      group: "Defendant",
      x: 200,
      y: 150,
      connections: [
        { x: 100, y: 100 }, // Example connection back to the Judge
        // Add more connections as needed
      ]
    },
    {
      username: "Client1",
      role: "Client",
      group: "Defendant",
      x: 150,
      y: 200,
      connections: [
        { x: 100, y: 200 }, // Example connection to the Judge
        // Add more connections as needed
      ]
    },
    // Add more members as needed
  ];

  return (
    <div className="container mx-auto py-8" >
      <h1 className="text-3xl font-bold mb-4">Member Graph</h1>
      <div className="flex justify-center">
        <div className="relative">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-full border-2 border-gray-300 shadow-md p-4 absolute"
              style={{ top: `${member.y}px`, left: `${member.x}px` }}
            >
              <h2 className="text-lg font-semibold mb-2">{member.username}</h2>
              <p className="text-sm text-gray-600 mb-2">Role: {member.role}</p>
              <p className="text-sm text-gray-600 mb-2">Group: {member.group}</p>
            </div>
          ))}
          {members.map((member, index) => (
            member.connections.map((connection, connectionIndex) => (
              <div
                key={index + "-" + connectionIndex}
                className="absolute"
                style={{
                  top: `${member.y}px`,
                  left: `${member.x}px`,
                  width: `${Math.abs(member.x - connection.x)}px`,
                  height: `${Math.abs(member.y - connection.y)}px`,
                  transform: `rotate(${Math.atan2(connection.y - member.y, connection.x - member.x) * (180 / Math.PI)}deg)`,
                  transformOrigin: 'top left'
                }}
              >
                <div className="w-1 h-full bg-gray-300"></div>
              </div>
            ))
          ))}
        </div>
      </div>
    </div >
  )
}
