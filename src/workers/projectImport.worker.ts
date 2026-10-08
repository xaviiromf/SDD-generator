import {validateLibraryJob,type LibraryJob} from '../services/libraryJob';
self.onmessage=(event:MessageEvent<LibraryJob>)=>self.postMessage(validateLibraryJob(event.data));
