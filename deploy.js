const COS = require("cos-nodejs-sdk-v5");
const path = require("path");
const fs = require("fs/promises");
const distRelPath = require(path.resolve(
	__dirname,
	".vuepress/config.js",
)).dest;
const { spawn } = require("child_process");

const {
	COS_SECRET_ID,
	COS_SECRET_KEY,
	COS_TARGET_BUCKET,
	COS_BUCKET_REGION,
	// CURRENT_COMMIT_ID
} = process.env;

console.info(`Deploying to ${COS_TARGET_BUCKET}.`);

const cos = new COS({
	SecretId: COS_SECRET_ID,
	SecretKey: COS_SECRET_KEY,
});

const bucketInfo = {
	Bucket: COS_TARGET_BUCKET,
	Region: COS_BUCKET_REGION,
};

// async function getLastCommitId() {
//     return await new Promise((resolve, reject) => {
//         cos.getObject({
//             ...bucketInfo,
//             Key: 'last_commit_id',
//         }, (err, data) => {
//             if (err) reject(err)
//             else {
//                 let res = data.Body.toString().trim()
//                 if (/^.{8}$/.test(res)) resolve(res);
//                 else reject("Invalid commit id.");
//             };
//         });
//     })
// }

// async function getDiffFileList(lastCommitId) {
//     return new Promise((res, rej) => {
//         const diff = spawn('git', ['diff', lastCommitId, CURRENT_COMMIT_ID, '--name-only']);
//         let output = "";
//         diff.stdout.on('data', data => {
//             output += data
//         });
//         diff.on('close', code => {
//             if (code === 0) {
//                 res(output.trim().split('\n').map(Key => ({ Key })));
//             } else {
//                 rej("git diff failed: " + output);
//             }
//         });
//     })
// }

async function deleteFiles(files) {
	return await new Promise((resolve, reject) => {
		cos.deleteMultipleObject(
			{
				...bucketInfo,
				Objects: files,
				Quiet: true,
			},
			(err, data) => {
				if (err) reject(err);
				else resolve(data);
			},
		);
	});
}

async function uploadFiles(relPaths) {
	const files = relPaths.map((i) => ({
		...bucketInfo,
		Key: i.substring(distRelPath.length),
		FilePath: path.resolve(__dirname, i),
	}));
	return new Promise((resolve, reject) => {
		cos.uploadFiles(
			{
				files,
				SliceSize: 1024 * 1024,
			},
			function (err, data) {
				if (err) reject(err);
				else resolve(data);
			},
		);
	});
}

async function getAllFilesInBucket() {
	return await new Promise((resolve, reject) => {
		cos.getBucket(
			{
				...bucketInfo,
			},
			(err, data) => {
				if (err) reject(err);
				else resolve(data.Contents.map(({ Key }) => ({ Key })));
			},
		);
	});
}

async function listFilesInPath(dirRelPath) {
	const target = [];
	for (const i of await fs.readdir(dirRelPath, { withFileTypes: true })) {
		if (i.isDirectory()) {
			target.push(
				...(await listFilesInPath(path.posix.join(dirRelPath, i.name))),
			);
		} else {
			target.push(path.posix.join(dirRelPath, i.name));
		}
	}
	return target;
}

process.on("unhandledRejection", () => {
	process.exit(-1);
});

async function deploy() {
	const filesToDelete = await getAllFilesInBucket();
	if (filesToDelete.length > 0) {
		console.info("Deleting files:")
		filesToDelete.foreach(i => { console.log(i.Key) });
		await deleteFiles(filesToDelete);
	}
	const filesToUpload = await listFilesInPath(distRelPath)
	console.info("Uploading files:");
	filesToUpload.foreach(console.log);
	await uploadFiles(filesToUpload);
	console.info(`Deployment accomplished.`);
}

deploy();
