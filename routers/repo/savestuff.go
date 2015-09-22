// Copyright 2014 The Gogs Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

package repo

import (
	"io/ioutil"
	"path/filepath"

	"github.com/gogits/gogs/modules/middleware"
)

func SaveStuff(ctx *middleware.Context) {
	content := ctx.Query("content")

	err := ioutil.WriteFile(filepath.Join(ctx.Repo.GitRepo.Path + "/", "README.md"),
		[]byte(content), 0644);

  if err != nil {
  	ctx.JSON(200, "OK")
	} else {
		ctx.JSON(200, "NOT OK")
	}
}
