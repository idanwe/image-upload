import ImageResize from 'image-resize';

// namespacing
ImagesHelpers = {
  // Browser comptaible check that file is a file (https://github.com/meteor/meteor/issues/3207)
  // in chrome     typeof File => 'function'
  // but in safar  typeof File => 'object'
  checkFile: Match.Where(file => file instanceof File),
  checkBlob: Match.Where(blob => blob instanceof Blob),

  insertImage: function(file, { collection }, callback) {
    check(file, Match.OneOf(this.checkFile, this.checkBlob));
    check(collection, FS.Collection);
    check(callback, Function);

    file.owner = Meteor.userId();

    collection.insert(file, (err, imageDoc) => {
      if (err) {
        return callback(err);
      }

      imageDoc.update({
        $set: {
          'metadata.owner': Meteor.userId()
        }
      });

      return callback(null, imageDoc);
    });
  },

  insertAndResizeImage: function (file, options, callback) {
    check(file, this.checkFile);
    check(options, Object);
    check(callback, Function);

    ImageResize(file, options, (resizedImageBlob) => {
      this.insertImage(resizedImageBlob, options, callback);
    });
  }
};
