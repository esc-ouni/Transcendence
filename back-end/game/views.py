from rest_framework.decorators import api_view
from rest_framework.response import Response

matchmaking_queue = []

# @api_view(['POST'])
# def matchmaking(request):
#     user_alias = request.data.get('alias')
#     if not user_alias:
#         return Response({"error": "Alias is required"}, status=400)

#     print(f'==> User id:{len(matchmaking_queue)}, alias:{user_alias} joined !')

#     matchmaking_queue.append(user_alias)

    
#     if len(matchmaking_queue) >= 2:
#         player1 = matchmaking_queue.pop(0)
#         player2 = matchmaking_queue.pop(0)
#         room_name = f"{player1}_vs_{player2}"
#         print(f'==> Room Created room_name:{room_name}, players: {player1}, {player2} Ready to Play !')

#         return Response({"room_name": room_name}, status=200)

#     return Response({"message": "Waiting for another player..."}, status=200)



@api_view(['POST', 'OPTIONS','GET'])
def matchmaking(request):
    try:
        if request.method == 'GET':
            return Response({"message": "Crazy Ajmi !"}, status=200)

        elif request.method == 'OPTIONS':
            response = Response()
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type"
            return Response({"message": "Waiting for another player..."}, status=200)

        user_alias = request.data.get('alias')
        print(f'==> alias: <{user_alias}> joined!')
        if not user_alias or user_alias == '':
            print('Test !')
            return Response({"message": "Alias is required"}, status=200)

        matchmaking_queue.append(user_alias)
        print(f'==> User id: {len(matchmaking_queue)}, alias: {user_alias} joined!')

        if len(matchmaking_queue) >= 2:
            player1 = matchmaking_queue.pop(0)
            player2 = matchmaking_queue.pop(0)
            room_name = f"{player1}_vs_{player2}"
            print(f'==> Room Created room_name: {room_name}, players: {player1}, {player2} Ready to Play!')
            return Response({"room_name": room_name}, status=200)

        return Response({"message": "Waiting for another player..."}, status=200)
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return Response({"error": "Something went wrong"}, status=500)