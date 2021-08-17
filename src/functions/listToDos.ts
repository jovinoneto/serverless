import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document.scan({
    TableName: "to_dos",
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id" : user_id
    }
  }).promise();

  const user = response.Count;
  const todos = response.Items;

  if(user > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        todos
      })
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "User or ToDo not found!",
    })
  }
}