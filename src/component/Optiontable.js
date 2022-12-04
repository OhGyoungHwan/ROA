import Table from "react-bootstrap/Table";

function TableBasic({ optionlist }) {
  return (
    <Table striped bordered hover className="my-2">
      <thead>
        <tr>
          <th>접두/접미</th>
          <th>현재수치</th>
          <th>최대수치</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(optionlist).map((value, idx) => (
          <tr key={idx}>
            <td>{value}</td>
            <td>{optionlist[value]}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableBasic;
