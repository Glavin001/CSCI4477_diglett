/* 
 * Dawson Reid
 */

var k2d = {
  /*
   * 
   * @param {type} cluster
   * @returns {exports.k2d.clusterMean.Anonym$2}
   */
  clusterMean: function(cluster) {
    var
            sum_x = 0,
            sum_y = 0;
    for (var i = 0; i < cluster.x.length; i++) {
      sum_x += cluster.x[i];
      sum_y += cluster.y[i];
    }

    return {
      x: sum_x / cluster.x.length,
      y: sum_y / cluster.y.length
    };
  },
  /*
   * 
   * @param {type} point1
   * @param {type} point2
   * @returns {undefined}
   */
  distance: function(point1, point2) {

    return Math.sqrt(
            (point1.x - point2.x) * (point1.x - point2.x) +
            (point1.y - point2.y) * (point1.y - point2.y)
            );
  },
  /*
   * 
   * @param {type} point
   * @param {type} cluster
   * @returns {Number}
   */
  selectCluster: function(point, clusters) {

    var
            minClusterDist = distance(point, clusters[0].centroid),
            clusterIndex = 0;
    for (var i = 1; i < clusters.length; i++) {
      if (minClusterDist > distance(point, clusters[i].centroid)) {
        minClusterDist = distance(point, clusters[i].centroid);
        clusterIndex = i;
      }
    }
    return clusterIndex;
  },
  /*
   * 
   * @param {type} cluster
   * @returns {exports.k2d.clusterRadius.radius_sum|@exp;cluster@pro;x@pro;length}
   */
  clusterRadius: function(cluster) {
    var radius_sum = 0;
    for (var i = 0; i < cluster.x.length; i++) {
      radius_sum = radius_sum + distance(cluster.centroid, {
        x: cluster.x[i],
        y: cluster.y[i]
      });
    }

    return radius_sum / cluster.x.length;
  }
};

/*
 * 
 * @param {type} data
 * @returns {Array}
 */
module.exports.kmeans = function(data) {

// confirm data object formatted properly
  if (
          data.x === undefined ||
          data.y === undefined ||
          data.maxIter === undefined ||
          data.centers === undefined) {
    throw  'Undefined fields in transmitted kmeans data object.';
  } else if (data.x.length !== data.y.length) {
    throw  'X and Y data set differ in size.';
  }

  clusters = [];
  // initialize my clusters
  for (var i = 0; i < data.centers; i++) {
    clusters[i] = {
      x: [],
      y: [],
      centroid: {
        x: data.x[i],
        y: data.y[i]
      },
      radius: 0
    };
  }

// create initial clusters
  for (var i = 0; i < data.x.length; i++) {

    var pointClusterIndex = selectCluster({
      x: data.x[i],
      y: data.y[i]
    }, clusters);
    clusters[pointClusterIndex].x.push(data.x[i]);
    clusters[pointClusterIndex].y.push(data.y[i]);
  }

// clustering loop
  for (var numIter = 0; numIter < data.maxIter; numIter++) {

// select new centroids
    for (var i = 0; i < clusters.length; i++) {
      clusters[i].centroid = clusterMean(clusters[i]);
      // reset cluster sets
      clusters[i].x = [];
      clusters[i].y = [];
    }

// create new clusters
    for (var i = 0; i < data.x.length; i++) {
      var pointClusterIndex = selectCluster({
        x: data.x[i],
        y: data.y[i]
      }, clusters);
      clusters[pointClusterIndex].x.push(data.x[i]);
      clusters[pointClusterIndex].y.push(data.y[i]);
    }
  }

// set the cluster radius
  for (var i = 0; i < clusters.length; i++) {
    clusters[i].radius = clusterRadius(clusters[i]);
  }

  console.log(JSON.stringify(clusters), null, 2);
  return clusters;
};
