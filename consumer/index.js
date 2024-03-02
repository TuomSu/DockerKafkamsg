import {Kafka, Partitioners} from 'kafkajs';
console.log("*** Consumer starts...***");

const kafka = new Kafka({
    clientId: 'checker-server',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'kafka-checker-servers1'});
const producer = kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});

const run = async () => {
    //Consuming
    await consumer.connect()
    await consumer.subscribe({topic: 'tobechecked', fromBeginning: true})
    await producer.connect()

    await consumer.run({
        eachMessage: async ({ topic, partition, message}) => {
            
            const fahrenheit = message.value;
            const celsius = ((message.value -32) *5)/9;
            const uuid = message.key;

            await producer.send({
                topic: 'convertedresult',
                messages:[
                    {
                        key:uuid,
                        value:JSON.stringify(celsius)
                    },
            ],
            });
            console.log(`Received (${uuid}) Fahrenheit temperature: ${fahrenheit}`);
            console.log(`Message with converted celsius value sent`);
        },
    })
}

run().catch(console.error);