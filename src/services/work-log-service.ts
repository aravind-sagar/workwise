'use server';

import { db } from '@/lib/firebase';
import type { WorkLog } from '@/lib/types';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, Timestamp, DocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

// Firestore converter to handle Date and Timestamp transformations
const workLogConverter = {
    toFirestore: (log: Omit<WorkLog, 'id'>) => {
        return {
            description: log.description,
            tags: log.tags,
            date: Timestamp.fromDate(new Date(log.date)),
            ticket: log.ticket || null,
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions): WorkLog => {
        const data = snapshot.data(options)!;
        return {
            id: snapshot.id,
            description: data.description,
            tags: data.tags,
            date: data.date.toDate().toISOString(),
            ticket: data.ticket,
        };
    }
};

const workLogsCollection = collection(db, 'work-logs').withConverter(workLogConverter);

export async function getWorkLogs(): Promise<WorkLog[]> {
  const q = query(workLogsCollection, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}

export async function addWorkLog(logData: Omit<WorkLog, 'id'>): Promise<WorkLog> {
    const docRef = await addDoc(workLogsCollection, logData);
    return { id: docRef.id, ...logData };
}

export async function updateWorkLog(logData: WorkLog): Promise<void> {
    const { id, ...data } = logData;
    const logDoc = doc(db, 'work-logs', id).withConverter(workLogConverter);
    await updateDoc(logDoc, data);
}
