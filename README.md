# Kafka app with Docker
## Sending and receiving messages that contain 
#### - an UUID to identily the passage of the message from one container to another
#### - a Fahrenheit degree to be converted to
#### - a Celsius degree

### Processes

1. Producer produces random fahrenheit and sends it with the UUID using channel 'tobechecked.
2. Created channel 'convertedresult' in createTopics and deleteTopics.
2. In Consumer established connection to Producer and Consumer receives the message and checks the value and key and sends it again.
3. Producer receives the message and acts as Consumer and shows the converted result in Celsius.