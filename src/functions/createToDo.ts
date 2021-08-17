import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { v4 as uuid } from "uuid";

interface ICreateToDo {
  title: string,
  deadline: string,
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateToDo;

  await document.put({
    TableName: "to_dos",
    Item: {
      id: uuid(),
      user_id,
      title,
      done: false,
      deadline,
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "ToDo created!",
    }),
    headers: {
      "Content-type": "application/json",
    }
  }
};