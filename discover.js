(async () => {
  let sortBy = "";
  let year = "";
  const getFavArray = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  };

  $("#year").on("input", async (e) => {
    console.log(e);
    year = /^\d{4}$/.test($(e.currentTarget).val())
      ? `&first_air_date_year=${$(e.currentTarget).val()}`
      : "";
    await callApi();
  });

  $("#sort").on("change", async (e) => {
    sortBy = $(e.currentTarget).val()
      ? `&sort_by=${$(e.currentTarget).val()}`
      : "";
    await callApi();
  });

  const displayViews = (data) => {
    if (!data) {
      $("#tv-shows").append(
        $("<div>")
          .addClass("alert")
          .addClass("alert-danger")
          .attr("role", "alert")
          .text("couldn't get tv-show list")
          .css({
            position: "absolute",
            bottom: 0,
          })
      );
      return;
    }
    data.results.forEach((tvShow) => {
      const link = $("<a>")
        .addClass("text-black-50")
        .addClass("text-decoration-none")
        .attr("href", `/individual.html?id=${tvShow.id}`);

      const cardWrapper = $("<div></div>")
        .addClass("col")
        .addClass("col-sm-3")
        .addClass("pt-2")
        .addClass("text-center");
      const card = $("<div></div>")
        .addClass("card")
        .addClass("position-relative")
        .addClass("mx-auto")
        .width("18rem");

      const favBtn = $("<i>")
        .attr("id", tvShow.id)
        .addClass("fa")
        .addClass("fa-heart")
        .css({
          color: getFavArray().includes(tvShow.id.toString()) ? "red" : "grey",
          position: "absolute",
          top: 8,
          right: 8,
        });
      card.append(favBtn);
      favBtn.click((e) => {
        if (getFavArray().includes(e.target.id)) {
          console.log("true");
          $(e.currentTarget).css("color", "grey");
          localStorage.setItem(
            "favorites",
            JSON.stringify(
              getFavArray().filter((v) => v !== e.currentTarget.id)
            )
          );
        } else {
          $(e.currentTarget).css("color", "red");
          localStorage.setItem(
            "favorites",
            JSON.stringify([...getFavArray(), e.target.id])
          );
        }
      });
      card.append(
        $("<img>")
          .addClass("card-img-top")
          .attr(
            "src",
            `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
          )
      );
      const cardBody = $("<div></div>").addClass("card-body");
      cardBody.append(
        $("<h5></h5>").addClass("card-title").text(tvShow.original_name)
      );
      cardBody.append(
        $("<p></p>")
          .addClass("card-text")
          .text(`vote average: ${tvShow.vote_average}`)
      );
      link.append(cardBody);
      card.append(link);
      cardWrapper.append(card);
      $("#tv-shows").append(cardWrapper);
    });
  };

  const callApi = async () => {
    $("#tv-shows").empty();
    let url =
      "https://api.themoviedb.org/3/discover/tv?api_key=1360011d3dfe8ec8bdc1196202d544b8&language=en-US&page=1";
    if (sortBy) url += sortBy;
    if (year) url += year;
    try {
      const data = await $.ajax({
        url,
      });
      displayViews(data);
    } catch (error) {
      displayViews(null);
    }
  };

  await callApi();
})();
