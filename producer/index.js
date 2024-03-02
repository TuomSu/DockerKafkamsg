import {Kafka, Partitioners} from 'kafkajs';
import {v4 as UUID} from 'uuid';
console.log("*** Producer starts...***");

const kafka = new Kafka({
    clientId: 'my-checking-client',
    brokers: ['localhost:9092']
});

const producer = kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});
const consumer = kafka.consumer({ groupId: 'kafka-checker-servers1'});

const run = async () => {
    //Producing
    await producer.connect()
    runConsumer();

    setInterval( () => {
        queueMessage();
    }, 2500)
}
run().catch(console.error);



async function queueMessage() {

    const fahrenheit = Math.random() * 200 - 100;
    const uuidFraction = UUID().substring(0,4);

    const success = await producer.send({
        topic: 'tobechecked',
        messages: [
            {
                key: uuidFraction,
                value: JSON.stringify(fahrenheit)
            },
        ],
    }
    );
if (success){
    console.log(`Message ${uuidFraction} succesfully to the stream`);
}else {
    console.log('Problem writing to stream..');
}

}

async function runConsumer(){
    await consumer.connect();
    await consumer.subscribe({
        topic: 'convertedresult',
        fromBeginning: true
    });
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const k = message.key;
            const v = message.value;
            console.log(`Message received with UUID ${k} celsius degrees are ${v}`);
        }
    })

}



